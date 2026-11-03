module.exports = (sequelize, DataTypes) => {
  const BlogPost = sequelize.define('BlogPost', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    kicker: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Guía Práctica'
    },
    authorName: {
      type: DataTypes.STRING,
      defaultValue: 'Redacción WayGass'
    },
    authorRole: {
      type: DataTypes.STRING,
      defaultValue: 'Equipo editorial de Motor y Ahorro'
    },
    authorAvatar: {
      type: DataTypes.STRING,
      defaultValue: '/logo.png'
    },
    readTime: {
      type: DataTypes.STRING,
      defaultValue: '6 min de lectura'
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dateISO: {
      type: DataTypes.STRING,
      allowNull: false
    },
    updatedDate: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    imageAlt: {
      type: DataTypes.STRING,
      allowNull: true
    },
    imageCaption: {
      type: DataTypes.STRING,
      allowNull: true
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    lead: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    intro: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    keyPoints: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    quote: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    table: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sections: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    verdict: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'published'
    },
    isAiGenerated: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'BlogPosts',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['slug']
      },
      {
        fields: ['category']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  // Helper para serializar los campos JSON al formato de frontend
  BlogPost.prototype.toArticleJSON = function () {
    const raw = this.toJSON();
    const safeParse = (str, fallback) => {
      if (!str) return fallback;
      if (typeof str !== 'string') return str;
      try {
        return JSON.parse(str);
      } catch (e) {
        return fallback;
      }
    };

    return {
      id: raw.id,
      slug: raw.slug,
      title: raw.title,
      kicker: raw.kicker || raw.category,
      category: raw.category,
      author: {
        name: raw.authorName || 'Redacción WayGass',
        role: raw.authorRole || 'Equipo editorial de Motor y Ahorro',
        avatar: raw.authorAvatar || '/logo.png'
      },
      readTime: raw.readTime || '6 min de lectura',
      date: raw.date,
      dateISO: raw.dateISO,
      updatedDate: raw.updatedDate,
      image: raw.image,
      imageAlt: raw.imageAlt || raw.title,
      imageCaption: raw.imageCaption || `Foto: Archivo WayGass / ${raw.title}`,
      excerpt: raw.excerpt,
      lead: raw.lead,
      intro: safeParse(raw.intro, []),
      keyPoints: safeParse(raw.keyPoints, []),
      quote: safeParse(raw.quote, null),
      table: safeParse(raw.table, null),
      sections: safeParse(raw.sections, []),
      verdict: safeParse(raw.verdict, null),
      isAiGenerated: !!raw.isAiGenerated,
      views: raw.views || 0,
      createdAt: raw.createdAt
    };
  };

  return BlogPost;
};
